const BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

async function request(path, { method = 'GET', body, headers = {}, ...opts } = {}) {
	const url = `${BASE}${path}`;
	const init = {
		method,
		headers: { 'Content-Type': 'application/json', ...headers },
		...opts,
	};
	if (body) init.body = JSON.stringify(body);

	const res = await fetch(url, init);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`${res.status} ${res.statusText}: ${text}`);
	}
	// tolerate empty responses
	const ct = res.headers.get('content-type') || '';
	if (!ct.includes('application/json')) return null;
	return res.json();
}

export const get = (path, opts) => request(path, { method: 'GET', ...opts });
export const post = (path, body, opts) => request(path, { method: 'POST', body, ...opts });

export default { get, post };
