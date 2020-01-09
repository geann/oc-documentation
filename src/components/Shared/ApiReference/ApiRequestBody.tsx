import {
  createStyles,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography,
  Paper,
} from '@material-ui/core'
import { VisibilityOutlined } from '@material-ui/icons'
import Prism from 'prismjs'
import React, { useEffect } from 'react'
import { OperationRequestBody } from '../../../models/openapi.models'
import {
  flame,
  maroon,
  seafoam,
  sherpablue,
  sunset,
} from '../../../theme/ocPalette.constants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pre: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    string: {
      color: flame[600],
    },
    boolean: {
      color: sunset[600],
    },
    array: {
      color: maroon[600],
    },
    object: {
      color: sherpablue[600],
    },
    integer: {
      color: seafoam[600],
    },
  })
)

interface ApiRequestBodyProps {
  requestBody?: OperationRequestBody
}
const ApiRequestBody: React.FunctionComponent<ApiRequestBodyProps> = (
  props: ApiRequestBodyProps
) => {
  useEffect(() => {
    Prism.highlightAll()
  })

  const { requestBody } = props
  const classes = useStyles({})

  let schema, required
  if (requestBody) {
    required = requestBody.content['application/json'].schema.required
    if (
      requestBody.content &&
      requestBody.content['application/json'] &&
      requestBody.content['application/json'].schema &&
      requestBody.content['application/json'].schema.allOf &&
      requestBody.content['application/json'].schema.allOf.length
    ) {
      schema = requestBody.content['application/json'].schema.allOf[0]
    } else {
      schema = requestBody.content['application/json'].schema
    }
    return (
      <React.Fragment>
        <Typography variant="h2">Request Body</Typography>
        {/** TODO: I have yet to see this appear; scrap or save for future use? */}
        {requestBody.description && (
          <Typography paragraph>{requestBody.description}</Typography>
        )}
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell style={{ maxWidth: 40 }}></TableCell>
                <TableCell style={{ width: 100 }}>Type</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>Max Length</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(schema.properties).map(
                ([name, field]: [string, any]) => (
                  <TableRow key={name}>
                    <TableCell>
                      {name}{' '}
                      {required && required.includes(name)
                        ? '(required)'
                        : null}
                    </TableCell>
                    <TableCell style={{ maxWidth: 40 }}>
                      {field.readOnly ? (
                        <Tooltip title="Read Only" placement="top">
                          <VisibilityOutlined />
                        </Tooltip>
                      ) : null}
                    </TableCell>
                    <TableCell style={{ width: 100 }}>
                      <code className={classes[field.type]}>
                        {field.type || 'object'}
                      </code>
                    </TableCell>
                    <TableCell>{field.format || '---'}</TableCell>
                    <TableCell>
                      {field.maxLength
                        ? `${field.maxLength} characters`
                        : '---'}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>
    )
  }
  return null
}

export default ApiRequestBody
