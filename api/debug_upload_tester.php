<?php
// Simple debug tester for uploads and lands API
// Place this file in the api/ folder and open it in the browser:
// http://localhost/Eaglonhytes-main/api/debug_upload_tester.php
// It will display current session info, allow uploading files to upload_image.php
// and optionally create a land record using the uploaded image relative paths.

// Minimal security: this is a developer helper and should be removed when done.
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Upload Tester</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; margin: 20px; background:#f6f8fa; color:#111 }
    .box { background: white; border-radius:8px; padding:16px; margin-bottom:16px; box-shadow:0 4px 12px rgba(0,0,0,0.06) }
    label{display:block;margin:8px 0 4px}
    input, select, textarea { width:100%; padding:8px; border:1px solid #ddd; border-radius:6px }
    button { padding:10px 14px; border-radius:6px; border:none; background:#1e40af; color:white; cursor:pointer }
    pre { max-height:320px; overflow:auto; background:#0b1220; color:#cfe8ff; padding:12px; border-radius:6px }
    .muted { color:#666; font-size:0.9rem }
  </style>
</head>
<body>
  <h2>API Upload / Land Tester</h2>

  <div class="box">
    <h3>Session</h3>
    <p class="muted">Shows current session info returned by <code>session.php</code></p>
    <pre id="session">Loading session...</pre>
    <button id="refreshSession">Refresh Session</button>
  </div>

  <div class="box">
    <h3>Upload Images</h3>
    <label>Select files (images)</label>
    <input id="files" type="file" multiple accept="image/*" />
    <label>Type (upload folder)</label>
    <select id="type">
      <option value="lands">lands</option>
      <option value="profile_pictures">profile_pictures</option>
      <option value="content">content</option>
      <option value="general">general</option>
    </select>
    <div style="margin-top:10px; display:flex; gap:8px">
      <button id="uploadBtn">Upload Files</button>
      <button id="uploadAndCreateBtn">Upload & Create Land</button>
    </div>
    <p class="muted">Upload responses:</p>
    <pre id="uploadResult">(none)</pre>
  </div>

  <div class="box">
    <h3>Create Land Payload</h3>
    <p class="muted">If you choose "Upload & Create Land" the uploaded file relative paths will be placed into the <code>images</code> field.</p>
    <label>Title</label>
    <input id="title" placeholder="Test Land Title" />
    <label>Address</label>
    <input id="address" placeholder="Street address" />
    <label>City</label>
    <input id="city" placeholder="City" />
    <label>State</label>
    <input id="state" placeholder="State" />
    <label>Price</label>
    <input id="price" type="number" placeholder="1000000" />
    <label>Size</label>
    <input id="size" placeholder="100" />
    <label>Amenities (comma separated)</label>
    <input id="amenities" placeholder="Water, Electricity" />
    <p class="muted">Create land responses:</p>
    <pre id="createResult">(none)</pre>
  </div>

  <script>
    const sessionEl = document.getElementById('session');
    const uploadResultEl = document.getElementById('uploadResult');
    const createResultEl = document.getElementById('createResult');

    async function fetchSession() {
      const btn = document.getElementById('refreshSession');
      try {
        btn.disabled = true;
        btn.textContent = 'Refreshing...';
        // Use a safe relative path to session.php (same directory as this tester)
        const r = await fetch('./session.php', { credentials: 'include' });
        if (!r.ok) {
          const text = await r.text().catch(() => '');
          console.error('[debug tester] session fetch failed', r.status, text);
          sessionEl.textContent = `Error: HTTP ${r.status} - ${text}`;
          return;
        }
        const j = await r.json();
        sessionEl.textContent = JSON.stringify(j, null, 2);
      } catch (e) {
        console.error('[debug tester] session fetch error', e);
        sessionEl.textContent = 'Error: ' + e.message;
      } finally {
        btn.disabled = false;
        btn.textContent = 'Refresh Session';
      }
    }

    const refreshBtn = document.getElementById('refreshSession');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetchSession();
      });
    }
    // Initial load
    fetchSession();

    async function uploadFiles(files, type) {
      const results = [];
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('image', files[i]);
        fd.append('type', type);
        try {
          const res = await fetch('upload_image.php?type=' + encodeURIComponent(type), {
            method: 'POST',
            credentials: 'include',
            body: fd
          });
          const json = await res.json().catch(() => ({ success: false, rawText: 'Non-JSON response' }));
          results.push({ status: res.status, ok: res.ok, body: json });
        } catch (err) {
          results.push({ status: 0, ok: false, body: { success: false, message: err.message } });
        }
      }
      return results;
    }

    document.getElementById('uploadBtn').addEventListener('click', async () => {
      uploadResultEl.textContent = 'Uploading...';
      const input = document.getElementById('files');
      const type = document.getElementById('type').value;
      if (!input.files || input.files.length === 0) {
        uploadResultEl.textContent = 'No files selected';
        return;
      }
      const res = await uploadFiles(Array.from(input.files), type);
      uploadResultEl.textContent = JSON.stringify(res, null, 2);
    });

    document.getElementById('uploadAndCreateBtn').addEventListener('click', async () => {
      uploadResultEl.textContent = 'Uploading...';
      createResultEl.textContent = '(pending)';
      const input = document.getElementById('files');
      const type = document.getElementById('type').value;
      if (!input.files || input.files.length === 0) {
        uploadResultEl.textContent = 'No files selected';
        return;
      }
      const uploadRes = await uploadFiles(Array.from(input.files), type);
      uploadResultEl.textContent = JSON.stringify(uploadRes, null, 2);

      // Collect relative paths from responses
      const paths = [];
      for (const r of uploadRes) {
        if (r.body && r.body.success && (r.body.relative_path || r.body.relativePath)) {
          paths.push(r.body.relative_path || r.body.relativePath);
        }
      }

      // Build land payload
      const payload = {
        title: document.getElementById('title').value || 'Tester Land ' + Date.now(),
        description: 'Created by debug tester',
        address: document.getElementById('address').value || 'Test Address',
        city: document.getElementById('city').value || 'Test City',
        state: document.getElementById('state').value || 'Test State',
        price: Number(document.getElementById('price').value || 1000000),
        size: document.getElementById('size').value || '100',
        images: paths,
        features: document.getElementById('amenities').value || '',
        status: 'available',
      };

      try {
        const res = await fetch('lands.php', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => ({ success: false, rawText: 'Non-JSON response' }));
        createResultEl.textContent = JSON.stringify({ status: res.status, ok: res.ok, body: json }, null, 2);
      } catch (err) {
        createResultEl.textContent = JSON.stringify({ success: false, message: err.message }, null, 2);
      }
    });
  </script>
</body>
</html>
