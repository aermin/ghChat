const SHARE = 'SHARE';

const shareAction = (data = null) => ({
  type: SHARE,
  data,
});

export { SHARE, shareAction };
