# Road Freight Route Management Simulator

A static React + Vite educational web app for a 15-minute senior Bachelor logistics lesson: "Managing Road Freight in Local, Regional and Global Business Environments."

Students act as road freight operations planners managing the local, regional, and final-mile road freight stages that support a pharmaceutical shipment from Bahrain to Cobeco Pharma Wholesale BV in the Netherlands. Sea and air appear only as international connector modes.

Students compare:

- Option A: Cost-Efficient Road + Sea Plan. Local Bahraini logistics provider -> Dammam Port by road, Dammam Port -> Port of Rotterdam by sea, Port of Rotterdam -> Cobeco Pharma Wholesale BV by road. Total lead time: 27-37 days. Cost: BHD 3,500.
- Option B: Time-Critical Road + Air Plan. Local Bahraini logistics provider -> Riyadh logistics hub / airport by road, Riyadh -> Rotterdam Airport or Amsterdam Schiphol by air, airport -> Cobeco Pharma Wholesale BV by road. Total lead time: 3-5 days. Cost: BHD 10,000.

Both options are checked against a 40-day delivery requirement. The activity uses simplified classroom estimates so students can rank road freight risks/constraints and receive a route-specific road freight strategy.

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
