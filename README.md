# Road-Air-Road Freight Route Management Simulator

A static React + Vite educational web app for a 15-minute senior Bachelor logistics lesson: "Managing Road Freight in Local, Regional and Global Business Environments."

Students act as road freight operations planners managing the local, regional, and final-mile road freight stages that support a time-critical pharmaceutical shipment from Bahrain to Cobeco Pharma Wholesale BV in the Netherlands. Both route options use air freight internationally, but each uses a different regional road gateway and Netherlands airport.

Students compare:

- Option A: Dammam Gateway Road + Air Plan. Bahrain -> Dammam Airport by road, Dammam -> Rotterdam Airport by air, Rotterdam Airport -> Cobeco Pharma Wholesale BV by road. Total lead time: 5-8 days. Cost: BHD 8,000. Estimated CO2 emissions: 1,850 kg CO2e. Delivery status: risky against the 7-day requirement if delays occur.
- Option B: Riyadh Gateway Road + Air Plan. Bahrain -> Riyadh Airport by road, Riyadh -> Amsterdam Schiphol Airport by air, Amsterdam Schiphol Airport -> Cobeco Pharma Wholesale BV by road. Total lead time: 3-5 days. Cost: BHD 10,000. Estimated CO2 emissions: 2,450 kg CO2e. Delivery status: strong fit against the 7-day requirement.

Both options are checked against a 7-day delivery requirement. Option A is cheaper by BHD 2,000 and has approximately 24.5% lower estimated CO2 emissions, while Option B is faster by approximately 2-3 days and has stronger lead-time reliability. Students rank standard freight constraints and receive a route-specific strategy, score, recommendation, emissions comparison, and reflection prompt.

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
