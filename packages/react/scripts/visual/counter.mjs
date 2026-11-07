/** Visual cases for counter; see ../visual.config.mjs for the fields. */
const FS = 'sap-design-components-';

export default [
    ...['5', '25', '101', '999+'].map((text, nth) => ({
        label: `standalone ${text}`,
        ours: { story: 'components-counter--standalone', selector: `span.rounded-lg >> nth=${nth}` },
        ref: { story: `${FS}counter--primary`, selector: `.fd-counter >> nth=${nth}` }
    })),
    {
        label: 'inline',
        ours: { story: 'components-counter--inline', selector: 'p >> span.rounded-lg' },
        ref: { story: `${FS}counter--paragraph`, selector: 'p >> .fd-counter' }
    },
    ...['1', '20', '300', '999+'].flatMap((text, nth) => [
        {
            label: `notification ${text}`,
            ours: { story: 'components-counter--notification', selector: `span.rounded-lg >> nth=${nth}` },
            ref: { story: `${FS}counter--notifier`, selector: `.fd-counter--notification >> nth=${nth}` }
        },
        {
            label: `notification button ${text}`,
            ours: { story: 'components-counter--notification', selector: `button >> nth=${nth}` },
            ref: { story: `${FS}counter--notifier`, selector: `.fd-button >> nth=${nth}` }
        }
    ])
];
