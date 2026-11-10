// Local framework exercise only. This is not a production authentication server.
const http = require('node:http');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>CRH Framework Demo</title></head>
<body><main><h1>Framework demo</h1>
<form id="login"><label>Email <input name="email" type="email" required></label>
<label>Password <input name="password" type="password" required></label>
<button type="submit">Sign in</button><p role="alert" hidden></p></form>
<section id="dashboard" hidden><h2>Demo dashboard</h2><p>Signed in as tester@example.test</p></section>
</main><script>
document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  if (data.get('email') === 'tester@example.test' && data.get('password') === 'demo-password') {
    form.hidden = true;
    document.querySelector('#dashboard').hidden = false;
  } else {
    const alert = form.querySelector('[role="alert"]');
    alert.textContent = 'Invalid email or password.';
    alert.hidden = false;
  }
});
</script></body></html>`;
http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  if (req.url !== '/') {
    res.writeHead(404);
    return res.end('Not found');
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}).listen(4173, '127.0.0.1');
