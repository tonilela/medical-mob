import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Qs from 'qs';
import { ENV } from '../constants/app';

const errorCodeMapper = Object.freeze({
  401: 'Niste prijavljeni',
  403: 'Zabranjen pristup',
  2003: 'Korisnik nije pronađen',
  2004: 'Korisnik već postoji',
  2006: 'Token za prijavu je neispravan',
  2007: 'Zabranjen pristup',
  2008: 'Korisnik nije vlasnik na klijentu',
  3000: 'Neispravan format računa (potreban je XML)',
  3002: 'Dogodio se problem prilikom parsiranja računa',
  3003: 'Prenesena datoteka nije račun',
  3004: 'Greška prilikom validacije računa',
  4000: 'Korisnik već ima ulogu na odabranom klijentu',
  4001: 'Klijent nije pronađen',
  4002: 'Nedovoljna razina pristupa na klijentu',
  5000: 'Klijent već postoji',
  5001: 'Klijent nije pronađen',
  6001: 'Mjerno mjesto nije pronađeno',
  7000: 'Korisnik već ima ulogu na odabranom mjernom mjestu',
  7002: 'Nedovoljna razina pristupa na mjernom mjestu',
  8000: 'Račun nije pronađen',
  9000: 'Tip računa nije pronađen',
  9001: 'Tip je povezan sa računom/ima',
});

export type ErrorCode = keyof typeof errorCodeMapper;

export enum HTTPMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}
export class ApiService {
  private static _instance = axios.create({
    baseURL: 'http://localhost:3003',
    paramsSerializer: (params) => {
      return Qs.stringify(params, { indices: false });
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  private static async _fetchApi(path: string, options: AxiosRequestConfig) {
    const response: AxiosResponse = await this._instance.request({
      url: path,
      ...options,
    });
    const refreshToken = response.headers['x-refresh-token'];
    if (refreshToken) ApiService.refreshAuthToken(refreshToken);
    const body = await response.data;
    const { status } = response;
    if (!status || status < 200 || status >= 300) {
      const error: any = new Error(body.error || response.statusText);
      error.status = status;
      error.code = body.code;
      error.data = body.data;
      throw error;
    }
    if (!('data' in body)) {
      return body;
    }
    return body.data;
  }
  static refreshAuthToken(token: string) {
    localStorage.setItem('token', token);
    this._instance.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
  static get(path: string, params?: any) {
    return () => this._fetchApi(path, { method: HTTPMethods.GET, params });
  }
  static post() {
    return (options: { data: object; path: string }) =>
      this._fetchApi(options.path, { method: HTTPMethods.POST, data: options.data });
  }
  static put() {
    return (options: { data: object; path: string }) =>
      this._fetchApi(options.path, { method: HTTPMethods.PUT, data: options.data });
  }
  static patch() {
    return (options: { data: object; path: string }) =>
      this._fetchApi(options.path, { method: HTTPMethods.PATCH, data: options.data });
  }
  static delete() {
    return (options: { data?: object; path: string }) =>
      this._fetchApi(options.path, { method: HTTPMethods.DELETE, data: options.data });
  }
  static getErrorMessage(code: ErrorCode) {
    return errorCodeMapper[code] || 'Dogodila se pogreška, molim pokušajte kasnije';
  }
}
