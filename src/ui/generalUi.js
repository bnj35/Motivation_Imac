export default class GeneralUi {
    constructor() {
        this.alternateYposition();
    }
    alternateYposition() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach((item, index) => {
            const card = item.querySelector('.timeline-content');

            if (index % 2 === 0) {
                card.style.transform = 'translateY(-75%)';
            } else {
                card.style.transform = 'translateY(75%)';
            }
        });
    }
} 