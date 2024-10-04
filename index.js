import 'dotenv/config';

await main();

async function main() {
    const baseUrl = "https://api.cloudflare.com/client/v4"

    const form = new FormData();

    const workerScript = 'export default {async fetch(request, env) { return new Response(\'Hello, World!\'); }}'

    form.append(
        "worker.js",
        new File([workerScript], "worker.js", {
            type: "application/javascript+module",
        }),
    );

    const metadata = {
        main_module: "worker.js",
        usage_model: "bundled",
        bindings: [],
    };

    form.append("metadata", JSON.stringify(metadata));

    // Versioning an existing Worker works.
    // https://developers.cloudflare.com/api/operations/worker-versions-upload-version
    
    /*
    const existingWorkerName = "example"

    const response = await fetch(`${baseUrl}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/workers/scripts/${existingWorkerName}/versions`, {
	    method: 'POST',
	    headers: {
		    'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
	    },
	    body: form,
    });
    */

    // The same upload form won't work for the "Upload Worker Module" endpoint.
    // https://developers.cloudflare.com/api/operations/worker-script-upload-worker-module
    // The response returns an error:
    /*
    {
        result: null,
        success: false,
        errors: [ { code: 10013, message: 'workers.api.error.unknown' } ],
        messages: []
    }
    */

    const newWorkerName = "example010101"

    const response = await fetch(`${baseUrl}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/workers/scripts/${newWorkerName}`, {
	    method: 'PUT',
	    headers: {
		    'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
	    },
	    body: form,
    });

    const json = await response.json()

    console.log(json)

}