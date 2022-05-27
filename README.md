# social-network
A social network with classic features like a profile, friend requests, real time persistent direct messaging and a group chat. 
Features in more detail:
registration/login/password-reset via AWS simple email for verification with generated code, image upload via multer to aws s3 bucket, profile text, friendships, group chat with access to history via more-button, realtime updates via websockets, toast notifications 

frontend:
react + plain css/html, redux, toastify

backend:
node.js/express, PostgreSQL, AWS simple email, Imagestorage in AWS s3 bucket, session-cookie, websockets

<br>This was my first react project, started out using from class components in the beginning for some componnents, then moved to functional components with hooks, then to using redux, redux thunk etc.
