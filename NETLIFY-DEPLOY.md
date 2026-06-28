# Deploy the Taste of Garlic Certification on Netlify

This keyless version uses Netlify for the website, secure grading, and private photo storage. A small Google Apps Script webhook writes certification results to **TOGarlic Certification** under your Google account.

You do **not** need a Google Cloud project, service account, or JSON key.

## 1. Create the Google Sheets webhook

1. Open [script.new](https://script.new) while signed into the Google account that should own the certification spreadsheet.
2. Rename the project **TOGarlic Certification Webhook**.
3. Replace everything in the default `Code.gs` with the contents of this package's `AppsScriptWebhook.gs`, then click **Save**.
4. In the function selector, choose `setupCertificationWebhook` and click **Run**.
5. Approve the requested Google Sheets and Drive permissions. This function finds or creates **TOGarlic Certification**, creates the **Certification Results** tab, and generates a private webhook secret.
6. Open **Executions**, select the completed setup run, and expand its logs. Copy these two values from the JSON output:

   - `spreadsheetUrl`
   - `webhookSecret`

7. Choose **Deploy > New deployment**.
8. Select **Web app** and use:

   - Execute as: **Me**
   - Who has access: **Anyone**

9. Click **Deploy** and copy the web-app URL ending in `/exec`.
10. Open that `/exec` URL in a browser. A working webhook displays:

    ```json
    {"ok":true,"service":"TOGarlic Certification webhook"}
    ```

The webhook is public only at the network level. Every write request must also contain the long secret generated during setup.

## 2. Deploy through Netlify

Serverless functions are part of this project, so use a Git-connected deployment rather than dragging only `Index.html` into Netlify.

1. Put this project folder in a private GitHub repository.
2. In Netlify, choose **Add new project > Import an existing project** and select the repository.
3. Confirm that the repository contains both the `public` and `netlify` folders. Netlify reads `netlify.toml`, publishes `public`, and does not run a build command.
4. Under **Project configuration > Environment variables**, add:

   - `APPS_SCRIPT_WEBHOOK_URL`: the deployed Apps Script URL ending in `/exec`.
   - `APPS_SCRIPT_WEBHOOK_SECRET`: the `webhookSecret` returned by `setupCertificationWebhook`.
   - `PHOTO_URL_SECRET`: any private random value containing at least 24 characters.

5. Deploy the project.
6. Open the Netlify site URL and complete one test certification.
7. Confirm that a row appears in **TOGarlic Certification > Certification Results** and that its Photo URL opens the uploaded dish image.

## Manager workflow

1. Open the **Certification Results** tab.
2. Open the cook's signed **Photo URL** and compare the dish with the CQPs.
3. Set **Photo Review** to `Approved` or `Needs Retry`.
4. **Final Status** updates automatically.

## Security and maintenance

- Keep `APPS_SCRIPT_WEBHOOK_SECRET` and `PHOTO_URL_SECRET` only in Netlify environment variables.
- Never put either secret in GitHub or the browser code.
- If the webhook secret is exposed, run `rotateCertificationWebhookSecret` in Apps Script, copy the new value into Netlify, and redeploy.
- Photos are encrypted at rest in Netlify Blobs. The Sheet stores signed, unguessable manager review links.

## Troubleshooting

- Opening the Apps Script URL shows an error: confirm the project contains `doGet` and that the deployment is a **Web app**.
- `APPS_SCRIPT_WEBHOOK_URL is missing`: add the `/exec` URL in Netlify and redeploy.
- `Apps Script could not record the certification: Unauthorized request`: the webhook secrets in Apps Script and Netlify do not match.
- No spreadsheet row appears: open Apps Script **Executions** to inspect the latest `doPost` run.
- The local `file:///.../Index.html` page is only a visual preview. Real submissions work from the deployed Netlify URL or from `npm run preview`.
