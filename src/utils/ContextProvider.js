import React, {Component} from 'react';

export const RefsContext = React.createContext(null);

class ContextProvider extends Component {
    constructor(props) {
        super(props);

        this.informationRef=React.createRef();
        this.headerRef=React.createRef();
        this.helpRef=React.createRef();
        this.openURLRef=React.createRef();
        this.limitXRef=React.createRef();
        this.feedRef=React.createRef();
        this.deleteRef=React.createRef();
        this.nestedRef=React.createRef();
        this.reverseRef=React.createRef();
        this.divReversedRef=React.createRef();
        this.divNestedRef=React.createRef();
        this.collapseAllRef=React.createRef();
        this.expandAllRef=React.createRef();
        this.infoBoxRef=React.createRef();
        this.filterXRef=React.createRef();
        this.interlaceRef=React.createRef();
        this.simpleMenuRef=React.createRef();
        this.inputRef=React.createRef();
        this.limitInputRef=React.createRef();

        //for help
        this.refBubble = React.createRef();
        this.helpRefs = [
            {id: 'help1', ref: this.helpRef, position: null, },
            {id: 'information', ref: this.informationRef, position: null, },
            {id: 'openUrl', ref: this.openURLRef, position: null, },
            {id: 'feed', ref: this.feedRef, position: null, },
            {id: 'filter', ref: this.inputRef, position: null, },
            {id: 'filterX', ref: this.filterXRef, position: null, },
            {id: 'limit', ref: this.limitInputRef, position: null, },
            {id: 'limitX', ref: this.limitXRef, position: null, },
            {id: 'delete', ref: this.deleteRef, position: null, },
            {id: 'nested', ref: this.divNestedRef, position: null, },
            {id: 'reverse', ref: this.divReversedRef, position: null, },
            {id: 'info', ref: null, position: [121,136, false]}, // ref has to be null if we want to use positioning
            {id: 'plus', ref: null, position: [55,133, false]},
            {id: 'minus', ref: null, position: [55,140, false]},
            {id: 'ctrlPlus', ref: null, position: [55,133, "close"]},
            {id: 'minus2', ref: null, position: [115,215, "open"]},
            {id: 'minus3', ref: null, position: [35,150, "open"]},
            {id: 'collapse', ref: this.collapseAllRef, position: null, },
            {id: 'expand', ref: this.expandAllRef, position: null, },
            {id: 'id', ref: null, position: [22,120, false]},
            {id: 'header', ref: this.infoBoxRef, position: null, },
            {id: 'help2', ref: this.helpRef, position: null, },
        ];
    }

    render(){
        return(
            <RefsContext.Provider
                value={{
                    helpRefs: this.helpRefs,
                    headerRef: this.headerRef,
                    divNestedRef: this.divNestedRef,
                    nestedRef: this.nestedRef,
                    divReversedRef: this.divReversedRef,
                    reverseRef: this.reverseRef,
                    interlaceRef: this.interlaceRef,
                    collapseAllRef: this.collapseAllRef,
                    expandAllRef: this.expandAllRef,

                    helpRef: this.helpRef,
                    informationRef: this.informationRef,
                    openURLRef: this.openURLRef,
                    feedRef: this.feedRef,
                    inputRef: this.inputRef,
                    filterXRef: this.filterXRef,
                    limitInputRef: this.limitInputRef,
                    infoBoxRef: this.infoBoxRef,
                    limitXRef: this.limitXRef,
                    deleteRef: this.deleteRef,

                    refBubble: this.refBubble,
                }}
            >
                {this.props.children}
            </RefsContext.Provider>
        )
    }

}

export default ContextProvider;

