export default class Nav {
    constructor(){
        this.SectionNumber = document.querySelectorAll('.SectionNum');
        this.currentSection = 0;
        this.SectionNumber[this.currentSection].classList.add('active');

        document.addEventListener('DOMContentLoaded', () => {
            this.getCurrentSection();
            this.updateSection();
            
        });


    }

    updateSection() {
        this.SectionNumber.forEach((section) => {
            section.classList.remove('active');
        });
        this.SectionNumber[this.currentSection].classList.add('active');
    }

getCurrentSection() {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 1;
        
        if (window.scrollY < 200 ) {
            if (this.currentSection !== 0) {
                this.currentSection = 0;
                this.updateSection();
            }
            return;
        }

        let found = false;
        for (let i = sections.length - 1; i >= 0; i--) {
            const sectionTop = sections[i].offsetTop;
            if (scrollPosition >= sectionTop) {
                if (this.currentSection !== i) {
                    this.currentSection = i;
                    this.updateSection();
                }
                found = true;
                break;
            }
        }
    });
}

}