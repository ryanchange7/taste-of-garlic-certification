# Taste of Garlic Line Cook Certification

A mobile-first Google Apps Script quiz that:

- grades 12 recipe and CQP questions server-side;
- provides an English/Español switch for the complete cook experience, including questions, validation, results, and coaching;
- embeds the 2:41 Creamy Garlic Fettuccines Food Focus and requires watch confirmation;
- requires a finished-dish photo before submission;
- saves the photo to a private Google Drive folder;
- appends every attempt to **TOGarlic Certification**;
- gives the cook an immediate score and coaching;
- keeps final certification pending until a manager approves the photo.

Both language versions submit to the same **TOGarlic Certification** spreadsheet. Recipe values remain standardized in English in the reporting data so the dashboard combines all submissions correctly.

## Files

- `Code.gs` - quiz content, secure grading, Drive upload, spreadsheet setup, and result logging.
- `Index.html` - responsive cook-facing quiz.
- `appsscript.json` - Apps Script permissions and runtime settings.

## One-time deployment

1. Open [script.new](https://script.new) while signed into the Google account that should own the certification records.
2. Rename the project **Taste of Garlic Certification**.
3. Replace the default `Code.gs` with this project's `Code.gs`.
4. Add an HTML file named `Index`, then replace its contents with this project's `Index.html`.
5. In **Project Settings**, enable **Show "appsscript.json" manifest file in editor**. Replace that file with this project's `appsscript.json`.
6. In the function picker, select `setupCertification`, click **Run**, and approve the requested Sheets and Drive access. This creates:
   - a Google Sheet named **TOGarlic Certification**;
   - a private Drive folder named **TOGarlic Certification Photos**.
7. Open the execution log to copy the returned spreadsheet and photo-folder links.
8. Select **Deploy > New deployment > Web app**.
   - Execute as: **Me**
   - Who has access: use your Google Workspace organization when every cook has an account; otherwise use the narrowest option that allows your team to open the quiz.
9. Open the deployment URL and complete one test submission.

## Manager workflow

1. Open the **Certification Results** tab.
2. Open the cook's **Photo URL** and compare it with the recipe CQPs.
3. Set **Photo Review** to `Approved` or `Needs Retry`.
4. **Final Status** updates automatically:
   - `Certified`
   - `Pending Photo Review`
   - `Knowledge Retake Required`
   - `Photo Retry Required`

The Drive photo folder is private by default. If additional managers need photo access, run this once from the Apps Script editor:

```javascript
sharePhotoFolderWithReviewers('manager1@example.com,manager2@example.com')
```

## Existing spreadsheet option

If a native Google Sheet named **TOGarlic Certification** already exists, `setupCertification()` will find and configure it. To target a specific sheet explicitly, run:

```javascript
setCertificationSpreadsheet('GOOGLE_SPREADSHEET_ID')
```

## Certification standard

- Knowledge: 80% or higher (10 of 12 correct).
- Training: full-video watch confirmation is required.
- Skill evidence: one required photo of the selected Creamy Garlic Fettuccine.
- Final certification: knowledge pass plus manager-approved photo.

## Source materials

Quiz content is based on the provided Season of Garlic launch overview, promotional recipe cards, CQPs and Vital Behaviors, Culinary Shift Starter, Launch Details, and Service Shift Starter.
