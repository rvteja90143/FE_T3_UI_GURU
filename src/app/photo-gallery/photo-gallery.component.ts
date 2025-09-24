import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DataHandler } from '../common/data-handler';
import { GoogleAnalyticsHandler } from '../common/googleanalytics-handler';
import { MerkleHandler } from '../common/merkle-handler';
import { GA4Service } from '../services/ga4.service';
import { GA4DealerService } from '../services/ga4dealer.service';
import { MaterialModule } from '../material/material.module';
import { AdobeSDGHandler } from '../services/adobesdg.handler';
//import { Carousel } from 'bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-photo-gallery',
    standalone: true,
    imports: [MaterialModule,CarouselModule ],
    templateUrl: './photo-gallery.component.html',
    styleUrl: './photo-gallery.component.scss',
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('activeSlide', [
            state('active', style({
                transform: 'scale(1.4)',
                opacity: 1,
            })),
            state('inActive', style({
                transform: 'scale(0.7)',
                opacity: 0.8,
            })),
            transition('active => inActive', [
                animate('0.5s')
            ]),
            transition('inActive => active', [
                animate('0.5s')
            ])
        ])
    ]
})

export class PhotoGalleryComponent implements OnInit, AfterViewInit {
    @Input() images!: string;
    @Input() ind!: number;
    vin: any;
    GoalGAFirstTime: any = 0;

    imageUrls: any;
    year: any;
    make: any;
    model: any;
    heroImage: string = ''
    @ViewChild('carousel', { static: false }) carousel!: ElementRef;

    customOptions: OwlOptions = {
        loop: true,
        center: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 100,
        nav: true,
        startPosition: 0,
    
        items: 1,
        slideBy: 1
      }

    ngAfterViewInit() {
     }

   
    

    onImageError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = 'https://d11p9i1nddg3dz.cloudfront.net/jellybeans/noimage.png';
    }

    galleryMainCarousel(event: any): void {
         //DataHandler.userInteraction = true; 
        MerkleHandler.merkleexecutor('gallery-popup-carousel');
        GoogleAnalyticsHandler.googleAnalyticsExecutor('gallery-popup-carousel');
    }

    constructor(private ga4Service: GA4Service, private ga4dealerService: GA4DealerService
    ) {

        if (this.GoalGAFirstTime == 0) {
            GoogleAnalyticsHandler.googleAnalyticsExecutor('PhotoGallery-GaGoal');
            this.ga4Service.submit_to_api('PhotoGallery','','','','','','').subscribe((response) => {});
            //this.ga4dealerService.submit_to_api_ga4dealer('PhotoGallery').subscribe((response: any) => {});
            // this.ga4dealerService.fire_asc_events('PhotoGallery').subscribe((response: any) => {});
            this.GoalGAFirstTime = 1;
        }
        this.heroImage = DataHandler.heroImage;
    }

    setCarouselOptions() {
        const disableSwipe = this.imageUrls.length <= 1;
      
        this.customOptions = {
          ...this.customOptions,
          loop: !disableSwipe,
          mouseDrag: !disableSwipe,
          touchDrag: !disableSwipe,
          pullDrag: !disableSwipe,
          dots: !disableSwipe,
          nav: !disableSwipe
        };
      }

    ngOnInit(): void {
        this.vin = DataHandler.vin;         
        this.imageUrls =  this.images || [];
        this.setCarouselOptions();
        this.year = DataHandler.year;
        this.make = DataHandler.make;
        this.model = DataHandler.model;
    }

    galleryPopupClose(obj: any) {
        MerkleHandler.merkleexecutor('gallery-popup-close');
        GoogleAnalyticsHandler.googleAnalyticsExecutor('gallery-popup-close');
    }

    galleryThumbCarousel(obj: any) {
        MerkleHandler.merkleexecutor('gallery-popup-carousel');
    }

    public adobe_sdg_event(event_type: any, param: any = '', param1: any = '') {
        //console.log('PhotoGalleryComponent-', event_type);
        try {
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };

            interactionClick.site = "dealer";
            interactionClick.type = "func";
            interactionClick.location = "vehicle-information";
            interactionClick.name = "image-gallery";

            if (event_type == 'prev') {
                interactionClick.description = "previous-image";
            }
            if (event_type == 'next') {
                interactionClick.description = "next-image";
            }

            AdobeSDGHandler.eventLogger("interaction-click", interactionClick);
        } catch (e) {
            console.log('PhotoGalleryComponent-adobe_sdg_event issue', e);
        }
    }


}
