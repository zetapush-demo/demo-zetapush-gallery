const $cards = document.querySelector('#cards')
const $file = document.querySelector('[type="file"]')
const $form = document.querySelector('#form')
const $tags = document.querySelector('#tags')
const $progress = document.querySelector('.progress')

const UNSECURE_PATTERN = /^http:\/\/|^\/\//

const securize = (url, forceHttps) => url.replace(UNSECURE_PATTERN, 'https://')

const thumnail = ({ url, metadata }) => securize((metadata['thumb-500'] && metadata['thumb-500'].url) || url.url)

const chipTemplate = (tag) => `<div class="chip" data-tag="${tag}"></div>`

const cardTemplate = ({ name, url, metadata, tags } = {}) => `
  <div card-name="${name}" class="col s6 m4">
    <div class="card">
      <div class="card-image">
        <a href="${url.url}" target="_blank">
          <img src="${thumnail({ url, metadata })}" class="center-cropped">
        </a>
      </div>
      <div class="card-action">
        ${tags.map(chipTemplate).join('')}
      </div>
    </div>
  </div>
`

const upload = ({ file, url, httpMethod, guid, tags }) => {
  return $.ajax({
    url: securize(url),
    method: httpMethod,
    contentType: false,
    processData: false,
    data: file,
    headers: {
      'Content-Type': file.type
    }
  })
}

const render = (cards) => $cards.innerHTML = cards.map(cardTemplate).join('')
