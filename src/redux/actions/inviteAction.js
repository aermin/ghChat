const INVITE = 'INVITE';


const inviteAction = (data = null) => ({
  type: INVITE,
  data
});

export {
  INVITE,
  inviteAction,
};
