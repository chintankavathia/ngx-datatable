import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rowState'
})
export class RowStatePipe implements PipeTransform {
  transform(value: any, args: (row) => boolean) {
    if (args) {
      return args(value);
    } else {
      return false;
    }
  }

}
