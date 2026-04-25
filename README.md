# Road Freight Route Management Simulator

A static React + Vite educational web app for a 15-minute senior Bachelor logistics lesson: "Managing Road Freight in Local, Regional and Global Business Environments."

Students act as road freight operations planners managing the local, regional, and final-mile road freight stages that support a time-critical pharmaceutical shipment from Bahrain to Cobeco Pharma Wholesale BV in the Netherlands. Air appears as the international connector mode while the lesson focus stays on road freight coordination.

Students compare:

- Option A: Dammam Gateway Road + Air Plan. Local Bahraini logistics provider -> Dammam gateway / airport by road, Dammam -> Rotterdam Airport by air, Rotterdam Airport -> Cobeco Pharma Wholesale BV by road. Total lead time: 5-8 days. Cost: BHD 8,000. Delivery status: risky against the 7-day requirement if delays occur.
- Option B: Riyadh Gateway Road + Air Plan. Local Bahraini logistics provider -> Riyadh logistics hub / airport by road, Riyadh -> Rotterdam Airport or Amsterdam Schiphol by air, airport -> Cobeco Pharma Wholesale BV by road. Total lead time: 3-5 days. Cost: BHD 10,000. Delivery status: strong fit against the 7-day requirement.

Both options are checked against a 7-day delivery requirement. Option A is cheaper by BHD 2,000 and has delivery buffer risk, while Option B is faster by approximately 2-3 days and is the stronger time-critical option. The activity uses simplified classroom estimates so students can rank route-specific road freight risks and receive a practical management strategy.

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
