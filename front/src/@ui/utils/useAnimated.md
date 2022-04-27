# Usage example

```tsx
const [show, setShow] = useState(false);
const modalAnim = useAnimated(show, 500); // 500ms
```

If you want to keep the modal's state:

```tsx
<SomeModal
  //....
  anim={modalAnim}
>
  {' '}
  ...{' '}
</SomeModal>
```

If you don't want to keep the modal's state (this will rerender on every close):

```tsx
<SomeModal
  //....
  key={modalAnim.destroyKey}
  anim={modalAnim}
>
  {' '}
  ...{' '}
</SomeModal>
```

Or if you don't want to render the modal at all when it is closed:

```tsx
{
  modalAnim.state !== 'closed' && (
    <SomeModal
      // ....
      anim={modalAnim}
    >
      {' '}
      // ....{' '}
    </SomeModal>
  );
}
```

If you don't want to animate it for some reason, you can make an object that implements IAnim, and use that or to just use `useAnimated(show, 0)`, which means no delay.

If you want an animation specially for a styled component like for Modals which would be good to have, because the delay should be consistent.
you can make a custom hook and you could use it like this:

```tsx
const { anim, setShow } = Modal.useAnimation(false);
or`const { anim, open, close } = Modal.useAnimation(false);`;
```

instead of this:

```tsx
const [show, setShow] = useState(false);
const modalAnim = useAnimated(show, 500); // 500ms
```
