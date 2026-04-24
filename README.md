# Road Freight Decision Lab

A static React + Vite educational web app for a 15-minute senior Bachelor logistics lesson. Students act as logistics managers planning a refrigerated pharmaceutical road freight movement from Manama to Riyadh, then preparing the shipment for onward global distribution to Rotterdam.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production files will be created in `dist`.

## Deployment

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages

This is a Vite static app, so it can be deployed to GitHub Pages after building. If deploying to a repository subpath, configure the Vite `base` option in `vite.config.js`, for example:

```js
export default {
  base: "/your-repository-name/",
};
```

Use `base: "/"` for a custom domain or root deployment.

## Notes

- No paid APIs are used.
- No backend, database, or login is required.
- Activity progress is stored only in browser `localStorage`.
- The app is designed for mobile and desktop use in a short classroom Problem-Based Learning activity.
