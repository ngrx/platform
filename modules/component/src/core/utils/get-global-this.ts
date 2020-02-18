export function getGlobalThis() {
  // @ TODO discuss with ngRx-Team
  //  AND consider self
  return (global || window) as any;
}
