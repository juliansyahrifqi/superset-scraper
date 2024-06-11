export function delay(second) {
  const miliseconds = second * 1000;

  return new Promise(function (resolve) {
    setTimeout(resolve, miliseconds);
  });
}
