import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Center, Text } from "@tlon/indigo-react";
import { deSig } from '~/logic/lib/util';
import useGraphState from '~/logic/state/graph';


export default class GraphApp extends PureComponent {
  render() {
    const { props } = this;
    const associations =
      props.associations ? props.associations : { graph: {}, contacts: {} };
    const graphKeys = useGraphState(state => state.graphKeys);

    const { api } = this.props;

    return (
      <Switch>
        <Route exact path="/~graph/join/ship/:ship/:name/:module?"
          render={ (props) => {
            const resource =
              `${deSig(props.match.params.ship)}/${props.match.params.name}`;
            const { ship, name } = props.match.params;
            const path = `/ship/~${deSig(ship)}/${name}`;
            const association = associations.graph[path];


            const autoJoin = () => {
              try {
                api.graph.joinGraph(
                  `~${deSig(props.match.params.ship)}`,
                  props.match.params.name
                );
                
                
              } catch(err) {
                setTimeout(autoJoin, 2000);
              }
            };

            if(!graphKeys.has(resource)) {
              autoJoin();
            } else if(!!association) {
              props.history.push(`/~landscape/home/resource/${association.metadata.module}${path}`);
            }
            return (
              <Center width="100%" height="100%">
                <Text fontSize={1}>Redirecting...</Text>
              </Center>
            );
          }}
        />
      </Switch>
    );
  }
}

