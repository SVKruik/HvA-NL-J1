import newsData from '@/../fixtures/newsData.json';
import NewsOverviewItem from '@/components/news/NewsOverviewItem.vue';
import { mount } from '@vue/test-utils';

/**
 * News Tests – Overview Item
 * @author Jenelle Davelaar
 */

describe('NewsOverviewItem Component', () => {
    it('renders correctly with provided props', async () => {
        //First item in JSON file with news objects
        const propsData = newsData[0];

        //Give the component the props
        const wrapper = mount(NewsOverviewItem, {
            propsData
        });

        //Wait for created lifecycle hook to finish
        await wrapper.vm.$nextTick();

        //Checking if the component renders with the provided data
        expect(wrapper.find('.news-list-item').exists())
            .toBe(true);
        expect(wrapper.find('.news-list-title').text())
            .toBe(propsData.title);
        expect(wrapper.find('.news-list-date').text())
            .toBe(propsData.date);
        expect(wrapper.find('.news-list-image')
            .attributes('src'))
            .toBe(`https://files.stefankruik.com/news/${propsData.ticket}.png`);
        expect(wrapper.find('.middle h3').text())
            .toBe(propsData.type);
    });

    it('calls link method when clicked', async () => {
        //First item in JSON file with news objects
        const propsData = newsData[0];

        //Give the component the props
        const wrapper = mount(NewsOverviewItem, {
            propsData
        });

        //Mock the router.push method
        const pushMock = jest.fn();
        wrapper.vm.$router = { push: pushMock };

        //Simulate a click
        await wrapper.find('.news-list-item').trigger('click');

        //Checking if link method is called with correct route
        expect(pushMock).toHaveBeenCalledWith(`/news/${propsData.newsId}`);
    });
});
