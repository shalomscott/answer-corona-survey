# Answer Corona Survey 🤖

## How it Works

1. User navigates to `https://lambda_host/{USERS_TZ}`
2. Lambda function receives a request for `/{USERS_TZ}`.
   - Requests the survey page from _Survey Website_.
   - Saves the response cookies.
   - Requests the associated captcha.jpeg file.
   - Returns an HTML page with the embedded captcha.jpeg.
3. User receives the HTML page.
   - User's browser cracks the captcha puzzle.
   - Browser sends POST request to `/{USERS_TZ}/solution` with the captcha solution as payload.
   - User is redirected to "All done" page.
4. Lambda gets POST for `/{USERS_TZ}/solution`
   - Retrieves the cookies for `USERS_TZ` (because Lambdas are stateless)
   - Sends a survey submission to _Survey Website_ with the appropriate cookies and captcha solution.
5. Done ✋🎤

## Rationale

In the beginning, several naive approaches were attempted. Of course, initially I tried to crack the captcha inside the lambda itself, which would then allow me to run the function automatically, and on a schedule. However, it quickly became apparent that every method of OCR would need some special binaries which were not automatically supplied inside a Lambda. There exists a solution where one can create a custom Lambda Layer with any necessary binaries baked in, but I wasn't about that. In the end, the solution opted for was one where the user's browser does the heavy lifting.

Sadly this requires the human involvement of actually opening up a link. I am still convinced the result is much easier than filling out a survey by hand. Plus... it's kinda cool.
