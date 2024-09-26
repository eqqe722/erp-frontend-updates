import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const IncomingDocumentManagement = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState({
    title: '',
    type: '',
    status: 'pending',
  });
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: t('errorFetchingDocuments'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument({ ...newDocument, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/documents', newDocument);
      fetchDocuments();
      setNewDocument({ title: '', type: '', status: 'pending' });
      toast({
        title: t('documentAdded'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: t('errorAddingDocument'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.put(`/api/documents/${id}`, { status: 'archived' });
      fetchDocuments();
      toast({
        title: t('documentArchived'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error archiving document:', error);
      toast({
        title: t('errorArchivingDocument'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAssignTask = async (id) => {
    setSelectedDocument(documents.find(doc => doc.id === id));
    onOpen();
  };

  const handleTaskAssignment = async () => {
    try {
      await axios.put(`/api/documents/${selectedDocument.id}/assign`, { assignee: selectedDocument.assignee });
      fetchDocuments();
      onClose();
      toast({
        title: t('taskAssigned'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        title: t('errorAssigningTask'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Heading mb={4}>{t('incomingDocumentManagement')}</Heading>
      <VStack spacing={4} align="stretch">
        <form onSubmit={handleSubmit}>
          <HStack>
            <Input
              name="title"
              placeholder={t('documentTitle')}
              value={newDocument.title}
              onChange={handleInputChange}
              required
            />
            <Select
              name="type"
              placeholder={t('selectDocumentType')}
              value={newDocument.type}
              onChange={handleInputChange}
              required
            >
              <option value="invoice">{t('invoice')}</option>
              <option value="report">{t('report')}</option>
              <option value="contract">{t('contract')}</option>
            </Select>
            <Button type="submit" colorScheme="blue">
              {t('addDocument')}
            </Button>
          </HStack>
        </form>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('title')}</Th>
              <Th>{t('type')}</Th>
              <Th>{t('status')}</Th>
              <Th>{t('assignee')}</Th>
              <Th>{t('actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {documents.map((doc) => (
              <Tr key={doc.id}>
                <Td>{doc.title}</Td>
                <Td>{doc.type}</Td>
                <Td>{doc.status}</Td>
                <Td>{doc.assignee || '-'}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button size="sm" onClick={() => handleArchive(doc.id)} isDisabled={doc.status === 'archived'}>
                      {t('archive')}
                    </Button>
                    <Button size="sm" onClick={() => handleAssignTask(doc.id)}>
                      {t('assignTask')}
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('assignTask')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>{t('assignTo')}</FormLabel>
              <Input
                placeholder={t('enterAssigneeName')}
                value={selectedDocument?.assignee || ''}
                onChange={(e) => setSelectedDocument({ ...selectedDocument, assignee: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleTaskAssignment}>
              {t('assign')}
            </Button>
            <Button variant="ghost" onClick={onClose}>{t('cancel')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default IncomingDocumentManagement;
