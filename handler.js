/**
 * Please do not delete [used for Intellisense]
 * @param {ServerRequest} request The incoming webhook request
 * @param {Object.<string, any>} settings Custom settings
 * @return void
 */
async function onRequest(request, settings) {
  const requestBody = request.json();
  const res = await fetch('https://platform.segmentapis.com/v1beta/workspaces/<workspace-slug>/users', {
    method: 'get',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <Authorization token>',
      'cache-control': 'no-cache'
    },
  })
  .then(res => res.json())
  .then(json => Segment.track({
    userId: requestBody.userId,
    event:"Audit Function",
    properties: Object.assign({email: json.users.filter(user => {
      if (user.name.split('/')[1] === requestBody.userId) {
        return user;
      }
    })[0].email}, requestBody.properties)
  }))
  .catch(err => Segment.track({
    userId: requestBody.userId || "requestBodyMalformed",
    event:"Error",
    properties: err.json()
  }));
}