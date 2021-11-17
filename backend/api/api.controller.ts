interface Json<T> {
    greeting: T;
  }
  type ApiHelloResponse<T> = {
    json: (json: Json<T>) => void
  }

export default class ApiController {
    static apiGetHelloMessage<NoSeUsa>(_: NoSeUsa, res: ApiHelloResponse<string>) {
            //res.json({ greeting: process.cwd(), a: __dirname });
            res.json({ greeting: 'hello API' });
    }
}