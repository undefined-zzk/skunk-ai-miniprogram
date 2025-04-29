worker.onMessage(async function(res) {
	let buffer = '';
	try {
		const {
			stream,
			deepthink
		} = res
		for await (const chunk of stream) {
			buffer += chunk
			const events = buffer.split('\n\n');
			buffer = events.pop() || '';
			for (const event of events) {
				let chunkContent;
				const match = event.match(/^data: (.*)/);
				if (match && match[1] !== '[DONE]') {
					const chunk = JSON.parse(match[1]);
					if (deepthink) {
						const reasonContent = chunk.choices[0].delta.reasoning_content || '';
						if (reasonContent) {
							chunkContent = reasonContent;
						} else {
							chunkContent = chunk.choices[0]?.delta?.content || '';
						}
					} else {
						chunkContent = chunk.choices[0]?.delta?.content || '';
					}
					if (chunkContent) {
						// 真机上内容渲染太快，手动进行适当的延时
						const randomDelay = 30 + Math.floor(Math.random() * 21); // 30ms to 50ms delay
						await new Promise(resolve => setTimeout(resolve, randomDelay));
						worker.postMessage({
							chunk: chunkContent
						});
					}
				} else {
					worker.postMessage({
						chunk: '[DONE]'
					});
				}
			}
		}
	} catch (err) {
		worker.postMessage({
			chunk: '[DONE]'
		});
	} finally {
		buffer = ''
	}
});