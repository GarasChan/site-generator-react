export const BASE_COVER = '/cover.jpg';

export const getCoverFromMD = (text: string) => {
  const arr = text.match(/!\[.*\]\(.+\)/g);
  if (!arr?.length) {
    return BASE_COVER;
  }
  const result = arr[0].match(/!\[(.*)\]\((.+)\)/);
  if (result?.length !== 3) {
    return BASE_COVER;
  }
  return result[2] || BASE_COVER;
};

export const getCover = (cover?: string) => {
  return cover ?? BASE_COVER;
};
