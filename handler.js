/**
 * Please do not delete [used for Intellisense]
 * @param {ServerRequest} request The incoming webhook request
 * @param {Object.<string, any>} settings Custom settings
 * @return void
 */
async function onRequest(request, settings) {
  const requestBody = request.json();
  const usersURL = 'https://platform.segmentapis.com/v1beta/workspaces/' + settings.workspaceSlug + '/users'

  const res = await fetch(usersURL, {
    method: 'get',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + settings.workspaceToken,
      'cache-control': 'no-cache'
    },
  })
  .then(res => res.json())
  .then(json => Segment.track({
    userId: requestBody.userId,
    event: requestBody.properties.type,
    properties: Object.assign({email: json.users.filter(user => {
      if (user.name.split('/')[1] === requestBody.userId) {
        return user;
      }
    })[0].email}, requestBody.properties)
  }))
  .catch(err => Segment.track({
    userId: requestBody.userId || 'requestBodyMalformed',
    event:'Error',
    properties: err
  }));;
}