import { Component, Input, OnChanges} from '@angular/core';
import { NavigationNode } from 'app/navigation/navigation.model';

@Component({
    selector: 'aio-nav-item',
    templateUrl: 'nav-item.component.html',
})
export class NavItemComponent implements OnChanges {
    @Input() isWide = false;
    @Input() level = 1;
    @Input() node: NavigationNode;
    @Input() isParentExpanded = true;
    @Input() selectedNodes: NavigationNode[];

    isExpanded = false;
    isSelected = false;
    classes: {[index: string]: boolean };
    nodeChildren: NavigationNode[];

    ngOnChanges() {
        this.nodeChildren = this.node && this.node.children ? this.node.children.filter(n => !n.hidden) : [];

        if (this.selectedNodes) {
            const ix = this.selectedNodes.indexOf(this.node);
            this.isSelected = ix !== -1; // this node is the selected node or its ancestor
            this.isExpanded = this.isParentExpanded &&
        (this.isSelected || // expand if selected or ...
        // preserve expanded state when display is wide; collapse in mobile.
        (this.isWide && this.isExpanded));
        } else {
            this.isSelected = false;
        }

        this.setClasses();
    }

    setClasses() {
        this.classes = {
            ['level-' + this.level]: true,
            collapsed: !this.isExpanded,
            expanded: this.isExpanded,
            selected: this.isSelected
        };
    }

    headerClicked() {
        this.isExpanded = !this.isExpanded;
        this.setClasses();
    }
}
