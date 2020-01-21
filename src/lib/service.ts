import { Observable } from 'rxjs'

export class Response {
  progress: number
  url?: string | null | undefined
  constructor(progress: number, url?: string | null) {
    this.progress = progress
    this.url = url
  }
}

class FileUploadService {
  static interval = 0
  static upload = (file: File) => {
    console.log(file)
    const observable = new Observable<Response>((subscriber) => {
      let progress = 0.0
      subscriber.next(new Response(progress))
      FileUploadService.interval = window.setInterval(() => {
        progress += 0.02
        subscriber.next(new Response(progress))
        if (progress >= 1) {
          window.clearInterval(FileUploadService.interval)
          const url =
            'https://storage.googleapis.com/bekirli-logo/logo.png?x-goog-signature=066b6f9949045ac4973458ab16c574fc3dcc8bd6291b6e8dc7818628943252e210f0f4e8e5503722de9815014550ed69c511233c8f09d17845dced45a6cfe89fc947030a3447d5d68ef8c4c7417c6ce0b313c24519d4c22a98ab2105bf28acac3b3be12f1f3d93976e0a20eb95c47d07928b956691b45717b3c152a5c55a367e429166792646ccab69ee8de75ede92971d54d9746b11256fb1213208cc4dd787ab3851abe36dd46fd6dc95d8cde377d6ea74008198867e6a2daed6bc87fe0ed6d72e13347feffd1b93b329768d7713336f6e99e43adb8fe2206b0eb6b3f9bf5c5925b1d4c24441d093bfe5a6b765db0e48d9daa2df52e42f145ec3582fe6aaff&x-goog-algorithm=GOOG4-RSA-SHA256&x-goog-credential=compute-storage%40reactlogouploader.iam.gserviceaccount.com%2F20200121%2Fus%2Fstorage%2Fgoog4_request&x-goog-date=20200121T104625Z&x-goog-expires=604800&x-goog-signedheaders=host'
          subscriber.next(new Response(1, url))
          subscriber.complete()
        }
      }, 100)
    })

    return observable
  }

  static cancel = () => {
    window.clearInterval(FileUploadService.interval)
  }
}

export default FileUploadService
