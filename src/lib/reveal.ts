// Adds the `in` class once an element scrolls into view. Pair with the `.reveal` class.
export function reveal(node: HTMLElement, delay = 0) {
	node.classList.add('reveal');
	if (delay) node.style.setProperty('--d', `${delay}s`);

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('in');
					io.disconnect();
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
	);
	io.observe(node);

	return { destroy: () => io.disconnect() };
}
