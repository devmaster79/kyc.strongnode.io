if (typeof window !== 'undefined') {
  // This stops leaking backend validation rules, but it gives us the possibility
  // to infer the validation types for frontend and backend at the same time.
  //
  // NOTE: TS will remove normal imports as well that imports only type.
  // So you can use both `import` and `import type`.
  // But if you see this message it means you import
  // something that you really should not.
  alert('THE FRONTEND SHOULD ONLY IMPORT THIS FILE AS TYPE (use import type)')
}
