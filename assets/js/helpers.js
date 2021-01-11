

export function rotateX(x, r, angle) {
  const X = r * Math.cos(angle * (Math.PI / 180));
  return x + X;
}

export function rotateY(y, r, angle) {
  const Y = r * Math.sin(angle * (Math.PI / 180));
  return y + Y;
}
