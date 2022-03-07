import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'disabled'
})
export class DisabledPipe implements PipeTransform {
  transform(value: any, args: (row) => boolean) {
    return args(value);
  }

}
