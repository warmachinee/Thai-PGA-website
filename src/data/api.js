export const fetchUrl = async (url) =>{
  const res = await fetch(url)
  const json = await res.json()
  return new Promise((resolve)=>{
    resolve(json)
  })
}
export const fetchPostUrl = async (url,object) =>{
  const res = await fetch(url,{
    async: true,
    crossDomain: true,
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(object),
  })
  const json = await res.json()
  return new Promise((resolve)=>{
    resolve(json)
  })
}
