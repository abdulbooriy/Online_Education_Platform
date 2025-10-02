export function checkRole(data) {
  return (req, res, next) => {
    const { role } = req.user;
    if (!data.includes(role))
      return res.status(405).send({ message: "Not Allowed!" });

    next();
  };
}
