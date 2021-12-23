function getLocalData(key) {
  return JSON.parse(localStorage.getItem(key))
}
function saveLocalData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}
function clearLocalData() {
  localStorage.clear()
}
function deleteLocalData(key) {
  localStorage.removeItem(key)
}

export default class LocalStorage {
  constructor(dataKey) {
    this.dataKey = dataKey
    this.data = getLocalData(dataKey)
  }
  #save() {
    saveLocalData(this.dataKey, this.data)
  }
  get() {
    this.data = getLocalData(this.dataKey)
    this.#save()
    return this.data
  }
  set(data) {
    this.data = data
    this.#save()
  }
  remove() {
    deleteLocalData(this.dataKey)
  }
  clearAll() {
    clearLocalData()
  }
}
