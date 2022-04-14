# We need to organize services better.

- Global handler for 5xx, 401 errors so that we don't have to write unique messages for every request for these errors.
- Replace axios with fetch, as it just consumes the space, and fetch is equally good to use.
- Type all requests and share all types with backend.
- Share URLs with backend like:
    ```ts
        export const findAllVestedBaseURL = () => '/history/findAllVested/';
        export const findAllVestedURL =
            (page: number, perPage: number) => `${findAllVestedBaseURL}?page=${page}&perPage=${perPage}`

        // backend would use findAllVestedBaseURL()
        // frontend would use findAllVestedURL(page, perPage)
    ```
- Unify responses like add { result: string } on every response type. Or it is even better to make classes for every response that could be converted into JSON and parsed from JSON as well, and we can share these with backend again.
- Help the usages of services, with custom hooks. like:
     - `const { loading, vesteds } = useVesteds({ page: pageNumber, perPage: 30 })`
       - Currently the useService hook tries to achieve this but it turned out that it is too complex, probably only I can understand it so I think we should move to another direction. Like one hook/service, that would ease the readability a lot. - david