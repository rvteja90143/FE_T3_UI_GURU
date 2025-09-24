import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { RestService } from '../services/rest.service';
import { DataHandler } from '../common/data-handler';
import { EventEmitterService } from '../event-emitter.service';
import { MerkleHandler } from '../common/merkle-handler';
import { GoogleAnalyticsHandler } from '../common/googleanalytics-handler';
import { ShiftDigitalHandler } from '../common/shift-digital';
import { GA4Service } from '../services/ga4.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from '../material/material.module';

import { GA4DealerService } from '../services/ga4dealer.service';
import { MatDatepicker, MatDatepickerActions, MatDatepickerInputEvent, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { AdobeSDGHandler } from '../services/adobesdg.handler';


@Component({
    selector: 'app-accessories',
    standalone: true,
    imports: [MaterialModule, CommonModule, MatSelectModule, MatFormFieldModule, FormsModule, MatDividerModule, MatIconModule, MatDatepickerToggle, MatDatepickerModule, MatDatepicker, ReactiveFormsModule, MaterialModule, MatButtonModule, MatDatepickerActions],
    templateUrl: './accessories.component.html',
    styleUrl: './accessories.component.scss'
})
export class AccessoriesComponent {
    accessories: any;
    shiftdigitalshow: any = 0;
    searchname: any;
    changeaccessoriesname: any;
    allcatogoryselecteditem: any;
    selecteditem: any;
    @Input() acc_vin!: any;
    timeoutid: any;
    timeout: any;
    isDisabled: boolean = false;
    accessories_count: any;
    displayAccessories: Array<any> = [];
    selectedAccessories: Array<any> = [];
    moparelement: Array<any> = [];
    accessories_loaded: boolean = false;
    inc_access_flag: any;
    merklesearch: any;
    isAccesoriesLoaded: string = 'loading';
    myfix: boolean = false;
    featured_accessories_select: any = 'featured';
    actionStatus: any;
    accessoriesTitle: any;
    category: any;
    showAll = false;
    isMobileScreen: boolean | undefined = false;
    make_url :string ='';
    isGreaterThanOne = false;
    categorCache: string[] = [];

    constructor(private restService: RestService, private ga4dealerService: GA4DealerService, private eventEmitterService: EventEmitterService, private ga4Service: GA4Service) {
    }


    ngOnInit(): void {
        this.get_accesories_details('home');
        this.isMobileScreen = DataHandler.isMobileScreen;
        this.eventEmitterService.subsVar = this.eventEmitterService.
            updatemoparFlag.subscribe((param: string) => {
                this.inc_access_flag = DataHandler.inc_access_flag;
            });
        if (!this.isMobileScreen) this.showAll = true;
    }

    ngAfterViewInit() {        
        this.make_url =DataHandler.make_url.toLowerCase() 
        if(DataHandler.make_url.toLowerCase()  == 'alfa')
        this.accessories =[];
    }




    getAvailableCategories(): string[] {

        if (this.categorCache.length === 0) {
            const categories = Object.keys(this.accessories_count);
            this.categorCache = categories.filter(category => this.accessories_count[category] >= 0);
        }
        return this.categorCache;
    }

    oncheckitem(item: any) {
    let actionType = '';
    if (item.property) {
      item.property = false;
      actionType = 'remove';
      DataHandler.selected_id = item.selected_id;
      MerkleHandler.merkleexecutor('remove-vehicle-accessories', '', item.accessories_title);
      this.ga4dealerService.fire_asc_events('remove-vehicle-accessories').subscribe((response: any) => { });
    } else {
      item.property = true;
      actionType = 'add';
      this.ga4dealerService.fire_asc_events('add-vehicle-accessories').subscribe((response: any) => { });
      this.ga4dealerService.fire_asc_events('Accessories-select').subscribe((response: any) => { });
      MerkleHandler.merkleexecutor('add-vehicle-accessories', '', item.accessories_title);
      GoogleAnalyticsHandler.googleAnalyticsExecutor('add-vehicle-accessories', 1, 'Delivery Accessories');
      DataHandler.shiftdigitalaccessoroesaddoname = item.accessories_title;
      DataHandler.shiftdigitalaccessoroesaddontype = 'Accessories';
      ShiftDigitalHandler.shiftdigitalexecutoraccessories('add accessories');
    }
    let diffCat = 0;

    for (let i = 0; i < this.accessories.length; i++) {
      if (this.accessories[i].id == item.id) {
        diffCat = 1;
        if (item.property) {
          this.accessories[i].property = true;
        } else {
          this.accessories[i].property = false;
        }
        if (this.accessories[i].property) {
          let sidx = this.check_exist_in_array(this.selectedAccessories, this.accessories[i].id);
          if (sidx == -1) {
            this.selectedAccessories.push(this.accessories[i]);
          }
          let didx = this.check_exist_in_array(this.displayAccessories, this.accessories[i].id);
          if (didx == -1) {
            this.displayAccessories.push({
              "title": this.accessories[i].accessories_title,
              "desc": this.accessories[i].accessories_info,
              "id": this.accessories[i].id,
              "part_number": this.accessories[i].part_number,
              "installation": this.accessories[i].installation_cost,
            });
          }
          if (!this.moparelement.includes(this.accessories[i].part_number)) {
            this.moparelement.push(this.accessories[i].part_number);
          }
        } else {
          let sidx = this.check_exist_in_array(this.selectedAccessories, this.accessories[i].id);
          if (sidx != -1) {
            this.selectedAccessories.splice(sidx, 1);
          }
          let didx = this.check_exist_in_array(this.displayAccessories, this.accessories[i].id);
          if (didx != -1) {
            this.displayAccessories.splice(didx, 1);
          }
          this.moparelement = this.moparelement.filter(value => value !== this.accessories[i].part_number);
        }
      }
    }
    if (diffCat == 0) {
      let sidx = this.check_exist_in_array(this.selectedAccessories, item.id);
      if (sidx != -1) {
        this.selectedAccessories.splice(sidx, 1);
      }
      let didx = this.check_exist_in_array(this.displayAccessories, item.id);
      if (didx != -1) {
        this.displayAccessories.splice(didx, 1);
      }
      this.moparelement = this.moparelement.filter(value => value !== item.part_number);
    }

    DataHandler.moparid = this.moparelement.join(',');
    this.eventEmitterService.populateaccessories(this.displayAccessories);
    DataHandler.accessories = this.displayAccessories;
    DataHandler.selected_Accessories = this.displayAccessories.length;

    this.restService.add_accessories(
      item.accessories_title,
      item.id,
      item.accessories_info.replace(/\(/g, '{').replace(/\)/g, '}'),
      item.msrp,
      item.part_number,
      item.installation_cost,
      actionType
    ).subscribe(() => {
      this.timeout = setTimeout(() => {
        this.eventEmitterService.paymentleaserefresh([]);
        this.eventEmitterService.paymentcashrefresh([]);
        this.eventEmitterService.paymentfinancerefresh([]);
      }, 1500);
    });
  }

    check_exist_in_array(data: any, id: any) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == id) {
                return i;
            }
        };
        return -1;
    }

    get_accesories_details(group_name: any): void {
        if (group_name === 'home') {
            group_name = 'featured';
            DataHandler.group_selected_accessories = group_name;
            this.searchname = '';
            this.selecteditem = group_name;

            if (this.myfix === true && DataHandler.check_accessoies_load === true) {
                MerkleHandler.merkleexecutor("accessories-select", group_name);
            }

            if (DataHandler.accessoriesduplicate === 0) {
                DataHandler.accessoriesduplicate = 1;
            }
        } else {
            this.searchname = '';
            this.changeaccessoriesname = 'All Accessories';
            this.allcatogoryselecteditem = group_name;
            this.selecteditem = group_name;
            DataHandler.group_selected_accessories = group_name;
            MerkleHandler.merkleexecutor("accessories-select", group_name);
        }


        this.restService.accessories_details(group_name, '').subscribe(
            (response) => {
                const obj = JSON.parse(JSON.stringify(response));
                this.accessories_count = obj.accessories_count;

                this.isGreaterThanOne = Object.values(this.accessories_count).some((count: any) => count >= 1);
                this.accessories_loaded = true;

                if (this.accessories_loaded && this.accessories_count?.exterior > 0) {
                    DataHandler.check_accessoies_load = true;
                }

                // Reset only the current category's view list.
                // Do NOT reset selectedAccessories/displayAccessories so that selections persist across categories.
                this.accessories = [];

                if (obj.data.length > 0) {
                    obj.data.forEach((item: any) => {
                        const accessory = this.mapAccessory(item);

                        // Mark property based on cumulative selections; do not clear cumulative state on category switch
                        const alreadySelected = this.check_exist_in_array(this.selectedAccessories, accessory.id) !== -1;
                        if (accessory.is_checked && !alreadySelected) {
                            // If backend indicates checked, merge into cumulative selection
                            accessory.property = true;
                            this.selectedAccessories.push(accessory);
                        } else {
                            accessory.property = alreadySelected;
                        }

                        this.accessories.push(accessory);
                    });

                    // Recompute display list from cumulative selections to feed Review page
                    this.displayAccessories = this.selectedAccessories.map((acc: any) => this.mapDisplay(acc));
                    this.moparelement = this.selectedAccessories.map((acc: any) => acc.part_number);
                    DataHandler.moparid = this.moparelement.join(',');
                    this.eventEmitterService.populateaccessories(this.displayAccessories);
                    DataHandler.accessories = this.displayAccessories;
                    DataHandler.selected_Accessories = this.displayAccessories.length;
                }

            },
            (err) => {
                if (err.status === 500) {
                    this.isAccesoriesLoaded = 'error';
                }
                console.error('Error fetching accessories:', err);
            }
        );

        this.myfix = true;
    }
    private mapDisplay(item: any): any {
        return {
            title: item.accessories_title,
            desc: item.accessories_info,
            id: item.id,
            part_number: item.part_number,
            installation: item.installation_cost
        };
    }
    private mapAccessory(item: any): any {
        return {
            accessories_img: item.image,
            accessories_info: item.marketing_description,
            accessories_title: item.marketing_name,
            id: item.id,
            make: DataHandler.make,
            model: DataHandler.model,
            model_year: DataHandler.year,
            msrp: item.msrp,
            part_number: item.part_number,
            is_checked: item.is_checked ?? false,
            selected_id: item.selected_id ?? null,
            total_installation_on_cost: item.total_installation_on_cost ?? null,
            installation_cost: item.installation_cost ?? null,
            part_disclosure: item.part_disclosure ?? null,
            property: false,
            showFullDescription: false
        };
    }

    onKeyUpEvent(event: any) {
        this.searchname = event.target.value;
    }

    search_accrssories(search: string): void {
        this.searchname = search;
        let groupName = this.selecteditem || '';
        this.ga4dealerService.fire_asc_events('Accessories-search').subscribe((response: any) => { });

        this.restService.accessories_details(groupName, search).subscribe((response) => {
            const obj = JSON.parse(JSON.stringify(response));
            this.merklesearch = obj.data.length;
            this.accessories_count = obj.accessories_count;

            // Update only the current view list; keep cumulative selections intact across searches
            this.accessories = [];

            if (obj.data.length > 0) {
                obj.data.forEach((item: any) => {
                    const accessory = this.mapAccessory(item);

                    // Merge backend-checked items; otherwise reflect existing selection state
                    const alreadySelected = this.check_exist_in_array(this.selectedAccessories, accessory.id) !== -1;
                    if (accessory.is_checked && !alreadySelected) {
                        accessory.property = true;
                        this.selectedAccessories.push(accessory);
                    } else {
                        accessory.property = alreadySelected;
                    }

                    this.accessories.push(accessory);
                });

                // Recompute display list from cumulative selections to feed Review page
                this.displayAccessories = this.selectedAccessories.map((acc: any) => this.mapDisplay(acc));
                this.moparelement = this.selectedAccessories.map((acc: any) => acc.part_number);
                DataHandler.moparid = this.moparelement.join(',');
                this.eventEmitterService.populateaccessories(this.displayAccessories);
                DataHandler.accessories = this.displayAccessories;
                DataHandler.selected_Accessories = this.displayAccessories.length;
            } else {
                this.accessories = 1; // triggers template to show: "Sorry! we don't have ..."
            }
        });
    }

    emit_vehicledetails() {
        this.eventEmitterService.gotovehicledetails(1);
    }

    toggleShowAll() {
        this.showAll = !this.showAll;
    }

    merkle_search() {
        MerkleHandler.merkleexecutor("accessories-search", this.merklesearch, this.searchname);
    }

    public adobe_sdg_event(event_type: any) {
        //console.log('AccessoriesComponent-', event_type);
        try {
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };

            interactionClick.site = "dealer";
            interactionClick.type = "tool";
            interactionClick.page = "build-your-deal:accessories";

            if (event_type == 'select-accessories') {
                interactionClick.location = "accessory-selection";
                interactionClick.description = `${this.actionStatus}-${this.accessoriesTitle}`
                    .replace(/\s+/g, '-')  // Replace spaces with dashes
                    .replace(/[./()]/g, '')  // Remove periods, slashes, and parentheses
                    .replace(/--+/g, '-')  // Replace multiple dashes with a single dash
                    .toLowerCase();
            }

            AdobeSDGHandler.eventLogger("interaction-click", interactionClick);
        } catch (e) {
            console.log('accessories-component-adobe_sdg_event issue', e);
        }
    }

}
