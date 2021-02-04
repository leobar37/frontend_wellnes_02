import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { environment } from 'src/environments/environment';
import * as tus from 'tus-js-client';
@Injectable()
export class CloudinaryService {
  constructor(private http: HttpClient, private cloudinary: Cloudinary) {}
  uploadFileCloudinary(
    file: File,
    auth: { timestamp: number; signature: string }
  ) {
    const formData = new FormData();
    const url = `https://api.cloudinary.com/v1_1/${
      this.cloudinary.config().cloud_name
    }/upload`;

    formData.append('file', file);
    formData.append('api_key', environment.apiKeyCloudinary);
    formData.append('timestamp', String(auth.timestamp));
    formData.append('upload_preset', this.cloudinary.config().upload_preset);
    formData.append('signature', auth.signature);

    const headers = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest');

    return this.http
      .post(url, formData, { headers })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      )
      .toPromise();
  }
  uploadFileCloudinaryv2(
    file: File,
    auth: { timestamp: number; signature: string }
  ) {
    const formData = new FormData();
    const url = `https://api.cloudinary.com/v1_1/${
      this.cloudinary.config().cloud_name
    }/upload`;

    formData.append('file', file);
    formData.append('api_key', environment.apiKeyCloudinary);
    formData.append('timestamp', String(auth.timestamp));
    formData.append('upload_preset', this.cloudinary.config().upload_preset);
    formData.append('signature', auth.signature);

    const headers = new HttpHeaders()
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Content-Type', 'multipart/formdata');
    return this.http
      .post(url, formData, { headers, reportProgress: true })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }
  uploadFile(file: File, auth: { timestamp: number; signature: string }) {
    const url = `https://api.cloudinary.com/v1_1/${
      this.cloudinary.config().cloud_name
    }/upload`;
    const upload = new tus.Upload(file, {
      endpoint: url,
      retryDelays: [0, 3000, 6000, 12000, 24000],
      chunkSize: 1000,

      metadata: {
        filetype: file.type,
        api_key: environment.apiKeyCloudinary,
        signature: auth.signature,
        timestamp: String(auth.timestamp),
        upload_preset: this.cloudinary.config().upload_preset,
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      onError: async (error) => {
        console.log('ha ocurrido un error');

        console.log(error);

        return false;
      },
      onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
        console.log('load chunck');

        // this.fileStatusArr.forEach(value => {
        //   if (value.filename === filename) {
        //     value.progress = Math.floor(bytesAccepted / bytesTotal * 100);
        //     value.uuid = upload.url.split('/').slice(-1)[0];
        //   }
        // });
        // this.uploadStatus.next(this.fileStatusArr);
      },
      onSuccess: async () => {
        console.log('upload');

        // this.fileStatusArr.forEach(value => {
        //   if (value.filename === filename) {
        //     value.progress = 100;
        //   }
        // });
        // this.uploadStatus.next(this.fileStatusArr);
        return true;
      },
    });
    upload.start();
  }
  getSignature(): Promise<{ signature: string; timestamp: number }> {
    return this.http
      .get<{ signature: string; timestamp: number }>(
        `${environment.apiUrl}/media/signature`
      )
      .toPromise();
  }
}
