const erorrHander = (body,statusCode) => {
  res.status(statusCode).send(body);
}