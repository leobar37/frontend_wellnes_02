import { JwtService } from '@services/jwt.service';
export const Required = (
  target: Object,
  property: string,
  parameterIndex: number
) => {
  console.log('=========target======');
  console.log(target);
  console.log('========Property=========');
  console.log(property);
  console.log('===========parameter======');
  console.log(parameterIndex);
  return {
    get(): string {
      return 'hello';
    },
    set(v: any) {
      console.log('set call');
    }
  };
};

export const TestDecorator = () => {
  return (target: Object, property: string, parameterIndex: number) => {
    console.log('=========target======');
    console.log(target);
    console.log('========Property=========');
    console.log(property);
    console.log('===========parameter======');
    console.log(parameterIndex);
  };
};
export const CurrentUser = <T>() => {
  return (target: Object, key: string) => {
    const set = (v: T) => {
      console.log('call set');
    };
    const get = () => {
      return 'hello';
    };
    Reflect.defineProperty(target, key, { get, set });
  };
};
