import {DatePipe} from '@angular/common'

// further details on https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
export function saveBlobAsFile(blob: Blob, filename: string) {
    const newBlob = new Blob([blob], {type: ''})

    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob)
      return
    }

    const data = window.URL.createObjectURL(newBlob)

    const link = document.createElement('a')
    link.href = data
    link.download = filename
    link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}))

    setTimeout(_ => {
      window.URL.revokeObjectURL(data)
      link.remove()
    }, 100)
  }

export function generateTitle(selection: string[], topic: string, extension: string, datePipe: DatePipe): string {
    const currentDate = new Date()
    const currentDateString = datePipe.transform(currentDate, 'yyyy-MM-dd')
    const title = topic + '-' + selection.length + '_' + currentDateString + extension
    return title

}
