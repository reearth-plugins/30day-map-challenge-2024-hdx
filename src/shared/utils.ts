// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function postMsg(action: string, payload?: any) {
  globalThis.parent.postMessage(
    {
      action,
      payload,
    },
    "*"
  );
}
