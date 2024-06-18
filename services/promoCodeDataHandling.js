const setDate = (req, res, next) => {
  const { expirationDate } = req.body;

  const date = new Date();
  date.setFullYear(
    expirationDate.year,
    expirationDate.month -1,
    expirationDate.day
  );
  
  req.body.expirationDate = date;

  next();
};

export default {
  setDate,
};
