import { KlasaClient } from 'klasa';
const { defaultGuildSchema } = KlasaClient;

export default defaultGuildSchema
	.add('automod', folder => folder
		.add('enabled', 'boolean', { default: false })

		.add('perspective', subfolder => subfolder
			.add('enabled', 'boolean', { default: false })
			.add('channels', 'textchannel', { array: true })
			.add('toxicity', 'any', { array: true }))

		.add('words', subfolder => subfolder
			.add('enabled', 'boolean', { default: false })
			.add('channels', 'textchannel', { array: true })
			.add('list', 'string', { array: true })
			.add('action', 'any', { default: { action: 'kick', reason: 'Saying a blacklisted word' } }))

		.add('invite', subfolder => subfolder
			.add('enabled', 'boolean', { default: false })
			.add('channels', 'textchannel', { array: true })
			.add('action', 'any', { default: { action: 'kick', reason: 'Sending invites' } }))

		.add('repetition', subfolder => subfolder
			.add('enabled', 'boolean', { default: false })
			.add('channels', 'textchannel', { array: true })
			.add('action', 'any', { default: { action: 'kick', reason: 'Don\'t repeat messages!' } }))
	)

	.add('roles', folder => folder
		.add('warn', 'role')
		.add('kick', 'role')
		.add('ban', 'role')
		.add('manager', 'role')
		.add('admin', 'role')
	);
