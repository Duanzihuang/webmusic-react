export const formatDuration = (duration) => {
  // 转分
  let min = Math.ceil(duration / 1000 / 60)
  min = min < 10 ? '0' + min : min
  // 秒
  let sec = Math.ceil((duration / 1000) % 60)
  sec = sec < 10 ? '0' + sec : sec
  return min + ':' + sec
}

export const formatCount = (count) => {
  if (count / 10000 > 10) {
    return parseInt(count / 10000) + '万'
  } else {
    return count
  }
}
